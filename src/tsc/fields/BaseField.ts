import { Common } from "src/common/Common";
import { $dom } from "src/common/DOMHelpers";
import {
  ContainerField,
  EmbedField,
  HtmlField,
  ImageField,
} from "src/fields/Fields";
import { bre } from "src/types/bre";
import { Selectors } from "src/ui/Selectors";

export abstract class BaseField<TData extends bre.Data = bre.Data> {
  public static get type(): string {
    let name = (this as any).name;
    name = name.replace("Field", "");
    name = name.substring(0, 1).toLowerCase() + name.substring(1);
    return name;
  }

  /**
   * Register Field Type
   */
  public static commonFieldsRegistered: boolean = false;

  /**
   * Register Field Type
   */
  public static registerCommonFields() {
    if (!this.commonFieldsRegistered) {
      HtmlField.registerField();
      ImageField.registerField();
      EmbedField.registerField();
      ContainerField.registerField();
    }
    this.commonFieldsRegistered = true;
  }

  public static createField<TData extends bre.Data = bre.Data>(
    $field: HTMLElement,
    data: TData,
    onSelect: (field: BaseField<TData>) => void,
    onUpdate: (property: keyof TData, oldValue: any, newValue: any) => void,
    onUpload?: (file: any, callback: (url: string) => void) => void
  ): BaseField<TData> {
    let fieldData = $dom.data<any>($field, "breField");
    if (!fieldData || !fieldData.name) {
      throw new Error(
        `There is no data or data doesn't contains 'name' in field ${$field.innerHTML}`
      );
    }

    // if data passed
    if (data !== undefined) {
      let addFieldData = {};
      // Object.keys(data).forEach(fieldName => {
      //   data[fieldName].
      // })
      for (const field in data) {
        if (field.name.toLowerCase() === fieldData.name.toLowerCase()) {
          // get current field data
          addFieldData = field;
          break;
        }
      }

      // if there is some additional data, pass it to data object
      if (addFieldData) {
        fieldData = Common.extend(fieldData, addFieldData);
      }
    }

    const type = fieldData.type;
    if (type != null) {
      // find field constructor in registered fields
      if (!BaseField.commonFieldsRegistered) {
        BaseField.registerCommonFields();
      }

      if (this._fields.hasOwnProperty(type)) {
        const field = this._fields[type];
        return new field($field, fieldData, onSelect, onUpdate, onUpload);
      } else {
        throw new Error(`${type} field not found`);
      }
    } else {
      throw new Error(`Field type not defined in data-bre-field attribute`);
    }
  }
  private static _fields: any = {};

  private static registerField() {
    // check if already registered to avoid dublicates
    if (this._fields.hasOwnProperty(this.type)) {
      delete this._fields[this.type];
    }

    // add field class to registered fields
    this._fields[this.type] = this;
  }

  public $field: HTMLElement;
  public name: string;
  public data: TData;
  protected onUpload: (file: any, callback: (url: string) => void) => void;

  protected settings: (field: BaseField<TData>) => void;
  private onSelect: (field: BaseField<TData>) => void;
  private onUpdate: (
    property: keyof TData,
    oldValue: any,
    newValue: any
  ) => void;

  constructor(
    $field: HTMLElement,
    data: any,
    onSelect: (field: BaseField<TData>) => void,
    onUpdate: (property: keyof TData, oldValue: any, newValue: any) => void,
    onUpload?: (file: any, callback: (url: string) => void) => void
  ) {
    this.$field = $field;
    this.data = data;
    this.onSelect = onSelect;
    this.onUpdate = onUpdate;
    this.onUpload = onUpload;
    this.bind();
  }

  public deselect() {
    this.$field.classList.remove(Selectors.selectorFieldSelected);
  }

  public getEl(): HTMLElement {
    const $el = this.$field.cloneNode(true) as HTMLElement;
    $el.attributes.removeNamedItem(Selectors.attrField);
    return $el;
  }

  protected getSettingsEl(): HTMLElement | null {
    return null;
  }

  protected bind() {
    // should be ovverided from child
  }

  protected select() {
    this.$field.classList.add(Selectors.selectorFieldSelected);
    this.onSelect(this);
  }

  protected updateProperty(
    prop: keyof TData,
    value: any,
    fireUpdate: boolean = true
  ) {
    const oldValue = this.data[prop];
    if (oldValue === value) {
      return;
    }

    this.data[prop] = value;

    if (fireUpdate) {
      this.onUpdate(prop, oldValue, value);
    }
  }
}