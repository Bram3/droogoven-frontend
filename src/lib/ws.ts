import { PUBLIC_API } from "$env/static/public";
import ioClient from "socket.io-client";

const socket = ioClient(PUBLIC_API)

export const io = socket
