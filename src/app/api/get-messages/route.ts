import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const userWithMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$message", preserveNullAndEmptyArrays: true } }, // ✅ Fixed: use "message" (your field name)
      { $sort: { "message.createdAt": -1 } }, // ✅ Fixed: use "message.createdAt" not "messages.createdAt"
      { $group: { _id: "$_id", messages: { $push: "$message" } } }, // ✅ Fixed: push "$message" not "$messages"
    ]);

    if (!userWithMessages || userWithMessages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 } // ✅ Fixed: use 404 for not found
      );
    }

    // Filter out null messages (from preserveNullAndEmptyArrays)
    const messages = userWithMessages[0].messages.filter((msg) => msg !== null);

    return Response.json(
      {
        success: true,
        messages: messages, // ✅ Fixed: return the processed messages
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Unexpected error occurred: ", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error", // ✅ Fixed: better error message
      },
      { status: 500 }
    );
  }
}

// Alternative simpler approach (recommended for debugging):
export async function GET_SIMPLE(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const userWithMessages = await UserModel.findById(user._id)
      .select("message") // Select the 'message' field from your schema
      .lean();

    if (!userWithMessages) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Sort messages by creation date (newest first)
    const messages = (userWithMessages.message || []).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return Response.json(
      {
        success: true,
        messages: messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Unexpected error occurred: ", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
