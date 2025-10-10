import type { Request, Response } from "express";

import { Conversation } from "../models/conversations.model.js";
import { Message } from "../models/message.model.js";
import { Group } from "../models/group.model.js";

export const getConversations = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.session.user._id;

  const conversations = await Conversation.findById(userId);

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
  let typeOfConversation;
  let messages;

  const isGroupId = await Group.findById(conversationId);
  if (isGroupId) {
    typeOfConversation = "group";
    messages = await Message.find({
      $or: [
        { senderId: userId, groupId: conversationId },
        { receiverId: userId, groupId: conversationId },
      ],
    }).sort({ createAt: -1 }); // Sort messages by create date ( newest to oldest )
  } else {
    typeOfConversation = "single user";
    messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: conversationId },
        { senderId: conversationId, receiverId: userId },
      ],
    }).sort({ createAt: -1 }); // Sort messages by create date ( newest to oldest )
  }

  return res.status(200).json({
    status: "Success",
    message: "Get user's messages successfully",
    messages,
    typeOfConversation,
  });
};
