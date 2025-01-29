import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { TBaseResponseProps } from "@/types/types-import";

export const baseResponse = (props: TBaseResponseProps) => {
  const { status, ...rest } = props;
  return NextResponse.json({ ...rest }, { status });
};

// OK response
export const successfulResponse = (props?: TOkResponseProps) => {
  const { message = "Successful", data } = props ?? {};
  return baseResponse({ message, status: StatusCodes.OK, data });
};

export const createdResponse = (props?: TOkResponseProps) => {
  const { message = "Created", data } = props ?? {};
  return baseResponse({ message, status: StatusCodes.CREATED, data });
};

// Not OK response
export const badRequestResponse = (props?: TNotOkResponseProps) => {
  const { message = "Bad Request", error } = props ?? {};
  return baseResponse({ message, status: StatusCodes.BAD_REQUEST, error });
};

export const unauthorizedResponse = (props?: TNotOkResponseProps) => {
  const { message = "Unauthorized", error } = props ?? {};
  return baseResponse({ message, status: StatusCodes.UNAUTHORIZED, error });
};

export const forbiddenResponse = (props?: TNotOkResponseProps) => {
  const { message = "for", error } = props ?? {};
  return baseResponse({ message, status: StatusCodes.FORBIDDEN, error });
};

export const notFoundResponse = (props?: TNotOkResponseProps) => {
  const { message = "Không tìm thấy", error } = props ?? {};
  return baseResponse({ message, status: StatusCodes.NOT_FOUND, error });
};

export const errorResponse = (props?: TNotOkResponseProps) => {
  const { message = "Lỗi xử lý", error } = props ?? {};
  return baseResponse({ message, status: StatusCodes.INTERNAL_SERVER_ERROR, error });
};
