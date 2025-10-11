import type { Request, Response } from "express";

import { Conversation } from "../models/conversations.model.js";
import { Message } from "../models/message.model.js";
import { Group } from "../models/group.model.js";
import { io, getSocketId } from "../config/socket.js";

export const getConversations = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.session.user._id;

  const conversations = await Conversation.find({ userId });

  return res.status(200).json({
    status: "Success",
    message: "Get user's conversations successfully",
    conversations,
  });
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.session.user._id;
  const conversationId = req.params.id;
  let type;
  let messages;

  const isGroupId = await Group.findById(conversationId);
  if (isGroupId) {
    type = "group";
    messages = await Message.find({ groupId: conversationId }).sort({
      createdAt: -1,
    }); // Sort messages by create date ( newest to oldest )
  } else {
    type = "user";
    messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: conversationId },
        { senderId: conversationId, receiverId: userId },
      ],
    }).sort({ createdAt: -1 }); // Sort messages by create date ( newest to oldest )
  }

  return res.status(200).json({
    status: "Success",
    message: "Get user's messages successfully",
    messages,
    type,
  });
};

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const content = req.body.content;
  const type = req.body.type;
  const senderId = req.session.user._id;
  const conversationId = req.params.id;
  const socketId = getSocketId(senderId);
  let statusMessage;

  // store message in database
  const messageData: any = { content, senderId };
  type === "user"
    ? (messageData.receiverId = conversationId)
    : (messageData.groupId = conversationId);
  const message = new Message(messageData);
  await message.save();

  io.to(socketId!).emit(
    "chat",
    {
      content,
      receiverId: conversationId,
      type,
    },
    (status: string) => {
      statusMessage = status;
    }
  );

  return res.status(201).json({
    status: "Success",
    message: "Message sent successfully",
    statusMessage,
  });
};
