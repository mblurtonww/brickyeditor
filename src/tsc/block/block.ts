import { toggleFieldSelection } from "src/fields/field";
import { getTemplate } from "src/template";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";
import { showBlockEditor, hideBlockEditor } from "src/block/blockEditor";
import { emmiter, BlockEventMap } from "src/emmiter";
import { bindFields } from "src/fields/fields";

export const selectField = (
  block: bre.core.block.Block,
  field: bre.ui.FieldBase
) => {
  block.selectedField = field;
};

export const toggleBlockSelection = (
  container: bre.core.IBlocksContainer,
  block: bre.core.block.Block,
  selected: boolean
) => {
  if (!selected && block.selectedField !== null) {
    toggleFieldSelection(block.selectedField, false);
  }

  const { classList } = block.$element;
  if (selected) {
    classList.add(Selectors.selectorBlockSelected);
  } else {
    classList.remove(Selectors.selectorBlockSelected);
  }

  if (selected) {
    showBlockEditor(block);
  } else {
    hideBlockEditor();
  }
};

export const createBlockFromData = (
  blockData: bre.core.block.BlockData
): bre.core.block.Block => {
  const blockTemplate = getTemplate(blockData.template);
  return createBlockFromTemplate(blockTemplate, blockData);
};

export const createBlockFromTemplate = (
  blockTemplate: bre.core.ITemplate,
  data: bre.core.block.BlockData = {
    template: blockTemplate.name,
    fields: []
  }
): bre.core.block.Block => {
  const $element = blockTemplate.$html.cloneNode(true) as HTMLElement;

  const ee = emmiter<BlockEventMap>();
  const block: bre.core.block.Block = {
    ...ee,
    $element,
    data,
    selectedField: null
  };

  block.fields = bindFields($element, block);
  block.fields.forEach(field => {
    if (field.on !== undefined) {
      field.on("focus", f => {
        if (f !== undefined) {
          selectField(block, f.field);
        }
      });
    }
  });

  return block;
};
