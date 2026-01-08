// Ten plik eksportuje metody GET i POST, które Auth.js
// wykorzystuje do komunikacji z dostawcami (Google/GitHub).
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
