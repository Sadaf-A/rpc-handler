export type Tracking = "yes" | "limited" | "none";

export type Rpc = {
  url: string;
  tracking?: Tracking;
  trackingDetails?: string;
  isOpenSource?: boolean;
};

export function getRpcUrls(rpcs: Rpc[]) {
  const urls: string[] = [];
  rpcs.forEach((rpc) => {
    if (typeof rpc == "string") {
      urls.push(rpc);
    } else {
      urls.push(rpc.url);
    }
  });
  return urls;
}
