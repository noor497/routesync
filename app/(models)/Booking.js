import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
const bookingSchema = new Schema(
  {
    car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    city: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking; 