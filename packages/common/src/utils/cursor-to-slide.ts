export default (editorContent: string, selectionStart: number) => {
  const re =
    /^ {0,3}[\-][ \t]*[\-][ \t]*[\-][\- \t]*$|^ {0,3}[\*][ \t]*[\*][ \t]*[\*][\* \t]*$|^ {0,3}[_][ \t]*[_][ \t]*[_][_ \t]*$/gm;

  return ((editorContent.substring(0, selectionStart) || "").match(re) || [])
    .length;
};
