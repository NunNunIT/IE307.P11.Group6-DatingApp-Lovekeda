type TPosition = {
  lat: number;
  long: number;
};

type TResponseData = Record<string, unknown>;

type TOkResponseProps = {
  message?: string;
  data?: TResponseData | TResponseData[] | string;
}

type TNotOkResponseProps = {
  message?: string;
  error?: Error | string | undefined;
}
