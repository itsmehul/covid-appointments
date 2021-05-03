import { Button } from '@chakra-ui/button';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Divider, Flex, Heading, Text, VStack } from '@chakra-ui/layout';
import { Tag } from '@chakra-ui/tag';
import React from 'react';
import spacetime from 'spacetime';
import openInMaps from '../../utils/openInMaps';
import Session from '../Session';



const Center = ({ fee_type, name, sessions, from, to }) => {
	return (
		<VStack
			borderWidth='1px'
			borderRadius='lg'
			padding={5}
			align='stretch'
			maxWidth='md'
		>
			<Flex justify='space-between' flexWrap='wrap'>
				<VStack align='flex-start' marginBottom={5}>
					<Heading as='h3' size='md' textTransform='uppercase'>
						{name}
					</Heading>
					<Text>
						Open from{' '}
						<Tag>{spacetime().time(from).format('{time}')}</Tag> to{' '}
						<Tag>{spacetime().time(to).format('{time}')}</Tag>
					</Text>
					<Text fontSize='sm'>
						{fee_type === 'Paid'
							? 'This center provides paid vaccinations'
							: 'This center provides free vaccinations'}
					</Text>
				</VStack>
				<Button
					onClick={() => openInMaps(name)}
					variant='outline'
					rightIcon={<ArrowForwardIcon />}
				>
					Show in map
				</Button>
			</Flex>
			{sessions.map((session, i) => (
				<>
					{i !== 0 && <Divider />}
					<Session {...session} />
				</>
			))}
		</VStack>
	);
};

export default Center;
