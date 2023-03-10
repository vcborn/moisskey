import { ImageType } from "@/types/note";
import { FaArrowDown, FaArrowUp, FaTimes, FaEdit } from "react-icons/fa";
import { useAtom } from "jotai";
import { activesAtom, imageDialogAtom } from "@/lib/atoms";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useSortable } from "@dnd-kit/sortable";
import { twMerge } from "tailwind-merge";

export default function MImage({
  mkey,
  data,
}: {
  mkey: string;
  data: ImageType;
}) {
  const [width] = useWindowSize();
  const [actives, setActives] = useAtom(activesAtom);
  const [dialog, setDialog] = useAtom(imageDialogAtom);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: mkey,
      data: data,
      disabled: width < 1024,
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  function moveUp(nid: string) {
    const target = actives.findIndex((at) => at.id === nid);
    const targetElm = actives[target];
    const replaceElm = target === 0 ? actives[target] : actives[target - 1];
    setActives(
      actives.map((nt, i) => {
        if (i === target) return replaceElm;
        if (i === target - 1) return targetElm;
        return nt;
      })
    );
  }
  function moveDown(nid: string) {
    const target = actives.findIndex((at) => at.id === nid);
    const targetElm = actives[target];
    const replaceElm =
      target === actives.length - 1 ? actives[target] : actives[target + 1];
    setActives(
      actives.map((nt, i) => {
        if (i === target) return replaceElm;
        if (i === target + 1) return targetElm;
        return nt;
      })
    );
  }
  function deleteFrom(nid: string) {
    setActives(
      actives.filter((at) => {
        if (at.type === "url") return at.id !== nid;
        return true;
      })
    );
  }
  return (
    <div
      className={twMerge("bg-white z-50", isDragging && "invisible")}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="flex pl-2 text-sm relative" key={mkey}>
        <div className="w-full">
          <a href={data.quote} target="_blank" rel="noopener noreferrer">
            <h3 className="font-bold pt-2">{data.title}</h3>
          </a>
          <div className="py-4 w-full flex items-center gap-4">
            {data.url && (
              <img
                src={data.url}
                className="max-h-[7rem] max-w-[12rem]"
                alt={data.alt}
                referrerPolicy="no-referrer"
              />
            )}
            <p className="text-xs opacity-80 whitespace-pre-wrap">{data.alt}</p>
          </div>
        </div>
        <button
          className="hidden lg:block absolute top-1 right-1 group"
          onClick={() => deleteFrom(data.id)}
        >
          <FaTimes
            size={20}
            className="fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
          />
        </button>
        <div className="flex flex-col gap-1 items-center px-1 pt-2 lg:hidden">
          <button className="group" onClick={() => setDialog(data)}>
            <FaEdit
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
          <button className="group" onClick={() => deleteFrom(data.id)}>
            <FaTimes
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
          <button className="group" onClick={() => moveUp(data.id)}>
            <FaArrowUp
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
          <button className="group" onClick={() => moveDown(data.id)}>
            <FaArrowDown
              size={20}
              className="bg-gray-200 fill-gray-400 p-1 rounded duration-100 group-hover:fill-gray-600"
            />
          </button>
        </div>
      </div>
      <hr className="border-dotted" />
    </div>
  );
}
