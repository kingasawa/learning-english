export function GET(request: Request) {
  const SOCKET_SERVER_URL = 'http://localhost:3001'; // Thay đổi URL này thành URL của server của bạn
  return Response.json({ hello: 'world' });
}
