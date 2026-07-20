type FormatNameParams = {
	year: Number;
	month: Number;
	sequence: Number;
}
// still not sure about the format
export function formatName(params: FormatNameParams) {
	return `${params.year}0${params.month}0${params.sequence}`
}

export function renderFiles(list: HTMLUListElement, files: File[]) {
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

const errMsg = document.querySelector<HTMLParagraphElement>("#err")

export function setErr(msg: string) {
	if (!errMsg) return
	errMsg.innerText = msg
}

