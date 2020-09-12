import { bre } from '@/types/bre';
import { modal } from '@/modal';

export const propmtFieldEditorAsync = <TFieldData extends bre.field.FieldData>(
  field: bre.field.Field<TFieldData>
) =>
  new Promise<TFieldData | null>(resolve => {
    const { getEditor: editor } = field;

    if (editor === undefined) {
      resolve(null);
      return;
    }

    const { $element: $editor, data: updatedData } = editor(field);

    modal(
      $editor,
      () => {
        resolve(updatedData);
      },
      () => {
        resolve(null);
      }
    );
  });
