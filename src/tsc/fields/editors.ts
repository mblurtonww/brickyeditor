import { bre } from "@/types/bre";
import { dialog } from "@/modal";

export const propmtFieldEditorAsync = <TFieldData extends bre.field.FieldData>({
  editor,
  data
}: bre.field.Field<TFieldData>) =>
  new Promise<TFieldData | null>(resolve => {
    if (editor === undefined) {
      resolve(null);
      return;
    }

    const { $element: $editor, data: updatedData } = editor(data);

    dialog(
      $editor,
      () => {
        resolve(updatedData);
      },
      () => {
        resolve(null);
      }
    );
  });