import { Button, ButtonGroup } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Grid, Heading, VStack } from '@chakra-ui/layout';
import { Tag } from '@chakra-ui/tag';
import { useToast } from '@chakra-ui/toast';
import React, { useMemo, useState } from 'react';
import spacetime from 'spacetime';

const Header = ({ fetchLocations }) => {
	const toast = useToast();
	const [selectedDate, setSelectedDate] = useState(spacetime.today());
	const [pincode, setPincode] = useState();

	const dateInAWeekFromSelectedDate = useMemo(() => {
		return selectedDate.add(1, 'week');
	}, [selectedDate]);

	const validateRequest = () => {
		if (!pincode || !pincode.length) {
			toast({
				title: `Please enter a pincode first`,
				status: 'error',
				isClosable: true,
			});
			return false;
		}

		return true;
	};

	const nextWeek = () => {
		if (!validateRequest()) {
			return;
		}
		const nextDate = selectedDate.add(1, 'week');
		confirmfetchLocations(nextDate.format('{date-pad}-{month-pad}-{year}'));
		setSelectedDate(nextDate);
	};

	const prevWeek = () => {
		if (!validateRequest()) {
			return;
		}
		const nextDate = selectedDate.subtract(1, 'week');
		confirmfetchLocations(nextDate.format('{date-pad}-{month-pad}-{year}'));
		setSelectedDate(nextDate);
	};

	const confirmfetchLocations = (date) => {
		if (!validateRequest()) {
			return;
		}
		fetchLocations(date, pincode);
	};

	const isTodaySelected = selectedDate.isEqual(spacetime.today());
	return (
		<>
			<VStack
				maxW='lg'
				borderWidth='1px'
				borderRadius='lg'
				padding={5}
				margin='auto'
				spacing='30px'
				align='flex-start'
			>
				<Heading as='h2' size='md'>
					Where are you located?
				</Heading>
				<Grid
					templateColumns='repeat(auto-fit, minmax(130px,1fr))'
					gap={2}
					width='100%'
				>
					<Input
						variant='filled'
						placeholder='Enter Pin Code'
						onChange={(e) => setPincode(e.target.value)}
					/>
					<Button
						colorScheme='blue'
						variant='solid'
						onClick={() =>
							confirmfetchLocations(
								selectedDate.format(
									'{date-pad}-{month-pad}-{year}'
								)
							)
						}
						width='fit-content'
					>
						Find Centers
					</Button>
				</Grid>

				<ButtonGroup size='sm' isAttached variant='outline'>
					<Button
						disabled={isTodaySelected}
						colorScheme='blue'
						size='sm'
						onClick={prevWeek}
					>
						{isTodaySelected ? 'Today' : 'Previous Week'}
					</Button>
					<Button colorScheme='blue' size='sm' onClick={nextWeek}>
						Next Week
					</Button>
				</ButtonGroup>
				<Heading as='h2' size='md'>
					Centers are listed from{' '}
					<Tag>
						{selectedDate.format('{date-ordinal} {month-short}')}
					</Tag>{' '}
					to{' '}
					<Tag>
						{dateInAWeekFromSelectedDate.format(
							'{date-ordinal} {month-short}'
						)}
					</Tag>
				</Heading>
			</VStack>
		</>
	);
};

export default Header;
