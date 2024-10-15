import mitt from "mitt";
import type { CookbookSubscribeEmits } from "../utils/cookbook-dto";

export const emitter = mitt<{ data: CookbookSubscribeEmits }>();
