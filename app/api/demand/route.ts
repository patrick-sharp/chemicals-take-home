//export const GET = async (req: Request, res: Response) => {
export const GET = async (req: Request) => {
  console.log("GET REQUEST");
  //res.status(200).json({ message: 'Hello from Next.js!' });
  return Response.json({ message: 'Hello - GET' });
};
