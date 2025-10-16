import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const { Types } = mongoose;

// --- Subschemas ---
const attendanceSchema = new Schema(
  {
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "present", "absent"],
      default: "pending",
    },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: "Manager" },
  },
  { _id: false }
);

const documentSchema = new Schema(
  {
    type: { type: String, required: true },
    data: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const projectAssignmentSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["assigned", "in-progress", "completed"],
      default: "assigned",
    },
    assignedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// --- Main Intern Schema ---
export interface IIntern {
  fullName: string;
  college: string;
  course: string;
  department: string;
  semester: string;
  refNo: string;
  email: string;
  phone: string;
  interview: Date;
  recommendation: string;
  collegeId: string;
  certificate?: string;
  certificateId?: string;
  issueDate?: string;
  password?: string;
  role: "intern";
  isEmailVerified: boolean;
  verifiedAt?: Date;
  projectsAssigned: typeof projectAssignmentSchema[];
  mentor?: mongoose.Types.ObjectId;
  attendance: typeof attendanceSchema[];
  documents: typeof documentSchema[];
  applicationStatus: "unverified" | "verified" | "rejected";
  interviewSlot?: Date;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const internSchema = new Schema<IIntern>(
  {
    fullName: { type: String, required: true, trim: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: String, required: true },
    refNo: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    interview: { type: Date, required: true },
    recommendation: { type: String, required: true },
    collegeId: { type: String, required: true },
    certificate: { type: String },
    certificateId: { type: String, unique: true, sparse: true },
    issueDate: { type: String },
    password: { type: String },
    role: { type: String, default: "intern", enum: ["intern"] },
    isEmailVerified: { type: Boolean, default: true },
    verifiedAt: { type: Date },
    projectsAssigned: [projectAssignmentSchema],
    mentor: { type: Schema.Types.ObjectId, ref: "Manager" },
    attendance: [attendanceSchema],
    documents: [documentSchema],
    applicationStatus: {
      type: String,
      default: "unverified",
      enum: ["unverified", "verified", "rejected"],
    },
    interviewSlot: { type: Date },
    isActive: { type: Boolean, default: false },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// --- Pre-save hook for password ---
internSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Methods ---
internSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.password) return false; // Password not set yet
  return bcrypt.compare(candidatePassword, this.password);
};

internSchema.methods.verifyEmail = async function () {
  this.isEmailVerified = true;
  this.verifiedAt = new Date();
  return this.save();
};

// --- Export Model ---
export default mongoose.models.Intern || mongoose.model("Intern", internSchema);
