import mongoose from "mongoose";

const { Schema } = mongoose;

const internAssignmentSchema = new Schema(
  {
    intern: { type: Schema.Types.ObjectId, ref: "Intern", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    feedback: { type: String, trim: true },
    assignedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

export interface IProject {
  title: string;
  description: string;
  manager: mongoose.Types.ObjectId;
  interns: (typeof internAssignmentSchema)[];
  startDate?: string;
  endDate?: string;   
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    manager: { type: Schema.Types.ObjectId, ref: "Manager", required: true },
    interns: [internAssignmentSchema],
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
