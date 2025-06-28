import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { isValidObjectId } from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  // Await the params - this is the key change
  const { messageid } = await params;

  // Validate message ID format first
  if (!isValidObjectId(messageid)) {
    return Response.json(
      {
        success: false,
        message: "Invalid message ID format",
      },
      { status: 400 }
    );
  }

  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const user: User = session.user as User;

  try {
    // Add some logging for debugging
    console.log(
      "Attempting to delete message:",
      messageid,
      "for user:",
      user._id
    );

    // Fix: Changed 'message' to 'messages' (assuming your schema uses 'messages')
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { message: { _id: messageid } } }
    );

    console.log("Update result:", updateResult);

    // Check if any document was modified
    if (updateResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }

    // Return success response if message was deleted
    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in delete message route:", error);
    return Response.json(
      {
        success: false,
        message: "Error deleting message",
      },
      {
        status: 500,
      }
    );
  }
}
