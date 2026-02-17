export default function Input({ label, ...props }) {
    return (
      <div className="flex flex-col mb-3">
        <label className="text-sm font-medium mb-1">{label}</label>
        <input
          {...props}
          className="border rounded px-3 py-2 focus:ring focus:ring-blue-300"
        />
      </div>
    );
  }  