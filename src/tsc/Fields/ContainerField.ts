import { Block } from "src/Block/Block";
import { BlocksContainer } from "src/BlocksContainer";
import { $dom } from "src/Common/DOMHelpers";
import { BaseField } from "src/Fields/BaseField";
import { Selectors } from "src/UI/Selectors";

export class ContainerField extends BaseField {
  public container: BlocksContainer;
  private $placeholder: HTMLElement;

  public bind() {
    const field = this;
    const $field = this.$field;

    this.container = new BlocksContainer(
      $field,
      (block: Block) => {
        field.updateBlocks();
      },
      (block: Block) => {
        field.updateBlocks();
      },
      (block: Block) => {
        this.select();
      },
      (block: Block) => {
        //
      },
      (block: Block) => {
        field.updateBlocks();
      },
      (block: Block) => {
        field.updateBlocks();
      },
      field.onUpload,
      true
    );

    $dom.addClass($field, Selectors.selectorFieldContainer);
    $dom.on($field, "click", ev => {
      field.select();
      ev.stopPropagation();
      return false;
    });
  }

  public updateBlocks() {
    this.updateProperty("blocks", this.container.getData(true), true);
    this.updateProperty("html", this.container.getHtml(), true);
  }

  public deselect() {
    this.container.blocks.forEach(b => b.deselect());
    this.$field.classList.remove(Selectors.selectorFieldSelected);
  }

  public getEl(): HTMLElement {
    const html = this.container.getHtml();
    return $dom.el(html);
  }
}
