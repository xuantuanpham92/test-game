import { NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validators";
import {
  requireAdmin,
  verifyAdminCredentials,
  createAdminToken,
  setAdminCookie,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const credentials = await verifyAdminCredentials(username, password);

    if (!credentials) {
      return NextResponse.json(
        { success: false, error: "用户名或密码错误" },
        { status: 401 }
      );
    }

    const token = await createAdminToken(
      credentials.adminId,
      credentials.role
    );
    await setAdminCookie(token);

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "登录失败" },
      { status: 500 }
    );
  }
}
