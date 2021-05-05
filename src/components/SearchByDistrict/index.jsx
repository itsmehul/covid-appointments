import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Heading, Stack, Text, VStack } from '@chakra-ui/layout';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import { useToast } from '@chakra-ui/toast';
import {
	addHours,
	format,
	isWithinInterval,
	startOfToday,
	startOfTomorrow,
	startOfYesterday,
} from 'date-fns';
import React, { useState } from 'react';
import { districts } from '../../districts_list.json';

const SearchByDistrict = ({ fetchLocationsByDistrict, isSearching }) => {
	const toast = useToast();
	const [districtName, setDistrictName] = useState('');
	const [ageRestriction, setAgeRestriction] = useState('Any');
	const isDowntime = isWithinInterval(new Date(), {
		start: addHours(startOfYesterday(), 22),
		end: addHours(startOfToday(), 15),
	});

	const submitRequest = () => {
		let foundDistrict = districts.find(
			({ district_name }) => districtName === district_name
		);
		if (!foundDistrict) {
			toast({
				title: `District not found, please select one from the list`,
				status: 'error',
				isClosable: true,
			});
			return;
		}
		fetchLocationsByDistrict(
			foundDistrict.district_id,
			format(startOfTomorrow(), 'dd-MM-yyyy'),
			ageRestriction
		);
	};

	return (
		<>
			<VStack
				maxW='lg'
				borderWidth='1px'
				borderRadius='lg'
				padding={5}
				margin='auto'
				align='flex-start'
			>
				<Heading as='h2' size='md'>
					Where are you located?
				</Heading>
				<Input
					list='districts'
					name='browser'
					id='browser'
					placeholder='Find your district'
					onChange={(e) => {
						setDistrictName(e.target.value);
					}}
				/>
				<datalist id='districts'>
					{districts.map(({ district_name, district_id }) => (
						<option key={district_id} value={district_name} />
					))}
				</datalist>
				<label>Age Restriction</label>
				<RadioGroup
					defaultValue='Any'
					onChange={(e) => setAgeRestriction(e)}
				>
					<Stack spacing={5} direction='row'>
						<Radio colorScheme='green' value='18'>
							18+
						</Radio>
						<Radio colorScheme='green' value='45'>
							45+
						</Radio>
					</Stack>
				</RadioGroup>
				<Button
				colorScheme='teal'
					loadingText='Searching, keep tab open'
					isLoading={isSearching}
					onClick={submitRequest}
				>
					{`Search sessions for today & tomorrow`}
				</Button>
				<Text align="center" fontSize="xs">
					{isDowntime
						? 'Finding vacination slots during these hours in hard, try in the evening!'
						: 'Usually takes around 15-20 minutes., or longer, who knows? Persistence is key.'}
				</Text>
				<Text align="center" fontSize="xs">
					<i>For affirmation you can check out North Goa at 45+</i>
				</Text>
			</VStack>
		</>
	);
};

export default SearchByDistrict;
