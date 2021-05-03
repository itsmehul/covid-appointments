const axios = require('axios');
var fs = require('fs');
async function getDistricts() {
	// Get states
	const { data } = await axios.get(
		`https://cdn-api.co-vin.in/api/v2/admin/location/states`
	);

	async function someFunction() {
		let returnedData = [];
		for (let i = 0; i < data.states.length; i++) {
			// wait for the promise to resolve before advancing the for loop
			const districtData = await axios.get(
				`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${data.states[i].state_id}`
			);
			returnedData = [...returnedData, ...districtData.data.districts];
		}
		const sortedData = returnedData.sort((a, b) =>a.district_name.localeCompare(b.district_name))
		fs.writeFile(
			'districts_list.json',
			JSON.stringify(sortedData),
			() => {}
		);
	}
	someFunction();
}

getDistricts();
