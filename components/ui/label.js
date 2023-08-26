import { cx } from "@/utils/all";

export default function Label(props) {
  const margin = props.nomargin;

  if (props.pill) {
    return (
      <div
        className={
          "inline-flex h-6 shrink-0 items-center justify-center rounded-full bg-blue-50 px-2 text-sm font-bold text-blue-500 dark:bg-gray-800 dark:text-gray-300"
        }>
        {props.children}
      </div>
    );
  }

  return (
    <span
      className={cx(
        "inline-block text-xs font-medium uppercase tracking-wider ",
        !margin && " mt-5"
      )}>
      {props.children}
    </span>
  );
}
