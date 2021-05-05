import { Button } from '@chakra-ui/button';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
	Divider,
	Flex,
	Heading,

	Text,
	VStack
} from '@chakra-ui/layout';
import { Tag } from '@chakra-ui/tag';
import { format } from 'date-fns';
import React from 'react';
import openInMaps from '../../utils/openInMaps';

const Data = ({ label, value }) => {
	return (
		<Flex justify='space-between'>
			<Text textTransform='uppercase' fontSize='xs' fontWeight='bold'>
				{label}
			</Text>
			<Text fontSize='sm'>{value}</Text>
		</Flex>
	);
};

const SessionByDistrict = ({
	name,
	district_name,
	fee_type,
	fee,
	date,
	available_capacity,
	min_age_limit,
	vaccine,
	slots,
}) => {
	
	const dateParts = date.split('-')
	const parsedDate = new Date([Number(dateParts[1]),Number(dateParts[0]),Number(dateParts[2])])

	return (
		<VStack
			flexWrap='wrap'
			borderWidth='1px'
			borderRadius='lg'
			padding={5}
			align='stretch'
			maxWidth='md'
		>
			<Heading as='h3' size='xs'>
				{`${format(parsedDate,'do MMMM')} Session in ${district_name}`}
			</Heading>
			<Heading as='h4' size='sm'>
				{name}
			</Heading>
			<Divider />
			<Data label='Seats available' value={available_capacity} />
			<Data label='Min age limit' value={min_age_limit} />
			<Data label='Vaccine' value={vaccine} />
			<Data
				label='Fee'
				value={fee_type === 'Paid' ? `₹${fee}` : 'Free'}
			/>
			<VStack align='flex-start'>
				<Text textTransform='uppercase' fontSize='xs' fontWeight='bold'>
					Slots
				</Text>
				<Flex flexWrap='wrap'>
					{slots.map((slot) => (
						<Tag
							size='sm'
							key={slot}
							variant='solid'
							colorScheme='teal'
							marginRight={2}
							marginBottom={2}
						>
							{slot}
						</Tag>
					))}
				</Flex>
			</VStack>
			<Button
				onClick={() => openInMaps(name)}
				variant='outline'
				rightIcon={<ArrowForwardIcon />}
			>
				Show in map
			</Button>
		</VStack>
	);
};

export default SessionByDistrict;
