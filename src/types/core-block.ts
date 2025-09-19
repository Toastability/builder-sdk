import { ChaiBlock } from "@/types/chai-block";

export interface CoreBlock {
  blocks?: ChaiBlock[];
  data: any;
  props: { [key: string]: any };
  type: string;
  _name?: string;
  partialBlockId?: string;
  iconUrl?: string;
  icon?: any;
}
