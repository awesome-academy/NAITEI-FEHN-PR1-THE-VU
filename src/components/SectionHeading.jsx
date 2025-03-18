export default function SectionHeading({ heading }) {
  return (
    <div className="border-b-1 border-gray-400 relative mt-12 my-6">
      <h4 className="absolute bottom-[-3px] left-0 text-main border-b-4 border-main inline-block font-extrabold text-lg py-2">
        {heading}
      </h4>
    </div>
  );
}
