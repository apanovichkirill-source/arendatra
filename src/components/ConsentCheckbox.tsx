import Link from "next/link";

export function ConsentCheckbox({ required = true }: { required?: boolean }) {
  return (
    <label className="flex items-start gap-2 text-xs text-gray-600">
      <input type="checkbox" name="consent" required={required} className="mt-0.5" />
      <span>
        Согласен(на) на обработку персональных данных в соответствии с{" "}
        <Link href="/privacy" target="_blank" className="text-brand-blue hover:underline">
          политикой конфиденциальности
        </Link>
      </span>
    </label>
  );
}
