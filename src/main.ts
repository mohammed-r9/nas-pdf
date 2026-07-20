const input = document.getElementById("files") as HTMLInputElement;
const list = document.getElementById("file-list") as HTMLUListElement;

let files: File[] = [];

input.addEventListener("change", () => {
	files = Array.from(input.files ?? []);
	renderFiles();
});

const textFields = document.querySelectorAll<HTMLInputElement>("input[type='text']")

textFields.forEach((f: HTMLInputElement) => {
	f.addEventListener("focus", () => {
		if (f.value === "00") f.value = ""
	})
	f.addEventListener("blur", () => {
		if (f.value === "") f.value = "00"
	})
})

function renderFiles() {
	list.innerHTML = "";

	if (files.length === 0) {
		list.innerHTML = `
			<li class="text-center text-sm text-zinc-400">
				لم يتم اختيار أي ملفات بعد
			</li>
		`;
		return;
	}

	for (const file of files) {
		const li = document.createElement("li");
		li.className =
			"flex items-center justify-between rounded bg-white px-3 py-2 shadow-sm";

		li.innerHTML = `
			<span class="truncate">${escapeHtml(file.name)}</span>
			<span class="text-xs text-zinc-500">
				${formatSize(file.size)}
			</span>
		`;

		list.appendChild(li);
	}
}

function escapeHtml(str: string) {
	const div = document.createElement("div");
	div.textContent = str;
	return div.innerHTML;
}

function formatSize(bytes: number) {
	const units = ["B", "KB", "MB", "GB"];

	let value = bytes;
	let i = 0;

	while (value >= 1024 && i < units.length - 1) {
		value /= 1024;
		i++;
	}

	return `${value.toFixed(1)} ${units[i]}`;
}

// app logic goes below

const processButton = document.querySelector<HTMLButtonElement>("#process-btn")
processButton?.addEventListener("click", () => {
	console.log("button pressed")
})
