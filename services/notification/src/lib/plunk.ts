import Plunk from "@plunk/node";
const plunkKey = process.env.PLUNK_PUBLIC_KEY;
if (!plunkKey) throw new Error("Plunk API key not found");

const plunk = new Plunk(plunkKey);
export default plunk;