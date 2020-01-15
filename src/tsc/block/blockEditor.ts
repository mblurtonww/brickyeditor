import { helpers, px } from "src/helpers";
import { bre } from "src/types/bre";
import { deleteBlock, copyBlock, moveBlock } from "src/BlocksContainer";

import * as styles from "./blockEditor.scss";

const html = `<div class="bre-block-editor"></div>`;

const $tools = helpers.createElement(html);
$tools.className = "bre-block-editor";

const $delete = helpers.createElement("<button>del</button>");
const $clone = helpers.createElement("<button>cln</button>");
const $down = helpers.createElement("<button>dwn</button>");
const $up = helpers.createElement("<button>up</button>");

$tools.append($delete, $clone, $down, $up);

export const showBlockEditor = (
  container: bre.core.IBlocksContainer,
  block: bre.core.block.Block
) => {
  $delete.onclick = () => {
    deleteBlock(container, block);
  };

  $clone.onclick = () => {
    copyBlock(container, block);
  };

  $up.onclick = () => {
    moveBlock(container, block, -1);
  };

  $down.onclick = () => {
    moveBlock(container, block, 1);
  };

  block.$element.insertAdjacentElement("beforebegin", $tools);
};

export const hideBlockEditor = () => {
  $delete.onclick = null;
  $tools.remove();
};
