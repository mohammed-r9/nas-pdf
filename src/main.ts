import JSZip from "jszip";
import { renderFiles, setErr } from "./utils";
import { formatName } from "./utils";

const input = document.querySelector("#files") as HTMLInputElement;
const list = document.querySelector("#file-list") as HTMLUListElement;
const fileCount = document.querySelector<HTMLSpanElement>("#file-count")!;
const separator = document.querySelector<HTMLSpanElement>("#separator")!;

const yearInput = document.querySelector<HTMLInputElement>("#year")!;
const monthInput = document.querySelector<HTMLInputElement>("#month")!;
const startAtInput = document.querySelector<HTMLInputElement>("#start")!;

let files: File[] = [];

input.addEventListener("change", () => {
	files = Array.from(input.files ?? []);
	fileCount.innerText = files.length.toString() || ""
	separator.innerText = files.length > 0 ? ":" : ""
	files.sort((a, b) => a.lastModified - b.lastModified);

	renderFiles(list, files);
});

const textFields = document.querySelectorAll<HTMLInputElement>("input[type='text']");

textFields.forEach((f) => {
	f.addEventListener("focus", () => {
		if (f.value === "00") f.value = "";
	});

	f.addEventListener("blur", () => {
		if (f.value === "") f.value = "00";
	});
});

// app logic goes below

const processButton = document.querySelector<HTMLButtonElement>("#process-btn");

processButton?.addEventListener("click", async () => {
	const yearStr = yearInput.value.trim();
	const monthStr = monthInput.value.trim();
	const startAtStr = startAtInput.value.trim();

	if (files.length === 0) {
		setErr("يرجى تحديد ملف واحد على الأقل.");
		return;
	}

	if (yearStr === "" || yearStr === "00") {
		setErr("أدخل سنة صحيحة.");
		return;
	}

	if (monthStr === "" || monthStr === "00") {
		setErr("أدخل شهرًا صحيحًا.");
		return;
	}

	if (startAtStr === "" || startAtStr === "00") {
		setErr("أدخل رقمًا تسلسليًا صحيحًا.");
		return;
	}

	const year = Number(yearStr);
	const month = Number(monthStr);
	const startAt = Number(startAtStr);

	processButton.disabled = true;
	const originalText = processButton.textContent;

	try {
		const zip = new JSZip();

		files.forEach((file, index) => {
			const newName = formatName({
				year,
				month,
				sequence: startAt + index,
			});

			const extension = file.name.includes(".")
				? file.name.substring(file.name.lastIndexOf("."))
				: "";

			zip.file(`${newName}${extension}`, file);
		});

		const blob = await zip.generateAsync(
			{ type: "blob" },
			(metadata) => {
				processButton.textContent =
					`جاري الضغط... ${metadata.percent.toFixed(0)}%`;
			}
		);

		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "renamed-files.zip";
		a.click();

		URL.revokeObjectURL(a.href);
	} catch (err) {
		console.error(err);
		setErr("حدث خطأ أثناء إنشاء الملف المضغوط.");
	} finally {
		processButton.disabled = false;
		processButton.textContent = originalText;
	}
});
