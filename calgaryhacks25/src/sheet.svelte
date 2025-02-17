

<script lang="ts">
	// https://stackoverflow.com/questions/9905533/convert-excel-column-alphabet-e-g-aa-to-number-e-g-25

 function lettersToNumber(letters: string) {
	return letters.split('').reduce((r, a) => r * 26 + parseInt(a, 36) - 9, 0);
}

 function cellToIndex(cell: string) {
	const regex = new RegExp('([0-9]+)|([a-zA-Z]+)', 'g');
	const colRow = cell.match(regex);
	return { col: lettersToNumber(colRow?.[0] || ''), row: Number(colRow?.[1]) };
}

const chars = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z'
];
// https://www.npmjs.com/package/number-to-excel-header
 function numberToAlphabet(index: number): string {
	index -= 1;

	const quotient = Math.floor(index / 26);
	if (quotient > 0) {
		return numberToAlphabet(quotient) + chars[index % 26];
	}

	return chars[index % 26];
}


	// let { initialData }: { initialData: (Record<string, string > | null|undefined)[][] } = $props();
	let {
		data = $bindable()
	}: { data: ({ value?: string; bgColor?: string; color?: string } | null | undefined)[][] } =
		$props();

	// let data = $state(initialData || []);
	let editedCell: string | null = $state(null);
	let selectedCell: string | null = $state(null);
	let numRows = $derived(data.length > 10 ? data.length : 10);
	let numCols = $derived(data[0].length > 10 ? data[0].length : 10);
	let selectedCellObject = $derived.by(() => {
		if (!selectedCell) return null;
		const [row, col] = selectedCell.split(',');
		return data[Number(row)]?.[Number(col)];
	});

	function parseValue(value: string | undefined): string | number {
		if (!value) return '';
		if (value.startsWith('=')) {
			const funcName = value.split('(')[0].substring(1);
			const args = value.replace(`=${funcName}`, '').replace(/[()]/g, '').split(',');
			const vals = args.map((arg) => {
				const cell = cellToIndex(arg);
				const val = data[cell.row - 1]?.[cell.col - 1]?.value;
				if (val?.startsWith('=')) {
					return Number(parseValue(val));
				}
				return val ? Number(val) : 0;
			});
			return vals.reduce(
				(prev, curr) => {
					if (funcName === 'SUM') {
						return prev + curr;
					}
					if (funcName === 'MULTIPLY') {
						return prev * curr;
					}
					return 0;
				},
				funcName === 'MULTIPLY' ? 1 : 0
			);
		} else {
			return value;
		}
	}

	function init(el: HTMLInputElement) {
		el.focus();
	}
	function setCell(row: number, col: number, prop: 'value' | 'bgColor' | 'color', value: string) {
		if (data[row]) {
			if (data[row][col]) {
				data[row][col][prop] = value;
			} else {
				data[row][col] = { [prop]: value };
			}
		} else {
			data[row] = [];
			data[row][col] = { [prop]: value };
		}
	}
</script>

<!-- {#if selectedCell}
	<br />
	<label for="bgColor">Background</label>
	<input
		id="bgColor"
		value={selectedCellObject?.bgColor || ''}
		oninput={(e) => {
			if (!selectedCell) return;
			const [row, col] = selectedCell.split(',');
			setCell(+row, +col, 'bgColor', e.currentTarget?.value);
		}}
	/>
	<label for="fontColor">Font Color</label>
	<input
		id="fontColor"
		value={selectedCellObject?.color || ''}
		oninput={(e) => {
			if (!selectedCell) return;
			const [row, col] = selectedCell.split(',');
			setCell(+row, +col, 'color', e.currentTarget?.value);
		}}
	/>
	<br /><br />
{/if} -->
<table class="sheet">
	<tbody>
		{#each Array(numRows) as row, rowIndex}
			<tr>
				{#each Array(numCols) as column, colIndex}
					{@const currentCell = `${rowIndex - 1},${colIndex - 1}`}
					{@const cellData = data[rowIndex - 1]?.[colIndex - 1]?.value}
					<svelte:element
						this={rowIndex === 0 || colIndex === 0 ? 'th' : 'td'}
						role="button"
						tabindex="0"
						ondblclick={() => {
                            console.log(currentCell)
							editedCell = currentCell;
						}}
						onclick={() => {
							if (selectedCell === currentCell || rowIndex === 0 || colIndex === 0) return;
							selectedCell = currentCell;
							editedCell = null;
						}}
						class:selected={selectedCell === currentCell}
						style:background-color={data[rowIndex - 1]?.[colIndex - 1]?.bgColor}
						style:color={data[rowIndex - 1]?.[colIndex - 1]?.color}
					>
						{#if rowIndex === 0 && colIndex > 0}
							{numberToAlphabet(colIndex)}
						{/if}
						{#if rowIndex > 0 && colIndex === 0}
							{rowIndex}
						{/if}
						{#if rowIndex > 0 && colIndex > 0}
							{#if editedCell !== currentCell}
								<span>{cellData ? parseValue(cellData) : ''}</span>
							{:else}
								<input
									use:init
									style:background-color={data[rowIndex - 1]?.[colIndex - 1]?.bgColor}
									style:color={data[rowIndex - 1]?.[colIndex - 1]?.color}
									value={cellData || ''}
									oninput={(e) => {
										setCell(rowIndex - 1, colIndex - 1, 'value', e.currentTarget?.value);
									}}
								/>
							{/if}
						{/if}
					</svelte:element>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	.sheet {
		border-collapse: collapse;
		font-family: sans-serif;
		* {
			box-sizing: border-box;
		}
		tr {
			th {
				background-color: #eeeeee;
				color: #000;
			}
			td.selected {
				outline: 2px solid #3257f8;
				outline-offset: -2px;
			}
			th,
			td {
				min-width: 100px;
				height: 30px;
				border: 1px solid #dadada;
				span {
					padding: 5px;
					display: inline-block;
				}
				input {
					width: 100%;
					height: 100%;
					padding: 5px;
					margin: 0;
					border: none;
					font-size: 16px;
				}
			}
		}
	}
</style>
