import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Flex, Grid, Heading, Text, VStack } from '@chakra-ui/layout';
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/modal';
import React from 'react';
import spacetime from 'spacetime';

const Session = ({
	available_capacity,
	min_age_limit,
	date,
	slots,
	vaccine,
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [day, month, year] = date.split('-');
	return (
		<Flex flexWrap='wrap'>
			<VStack align='flex-start' maxWidth='300px'>
				<Heading as='h4' size='sm'>
					{spacetime([year, month, day]).format(
						'{date-ordinal} {month}'
					)}{' '}
					Session
				</Heading>
				<Button size='sm' onClick={onOpen}>
					Show available timings
				</Button>

				<Modal isOpen={isOpen} onClose={onClose} size='sm'>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>
							{spacetime([year, month, day]).format(
								'{date-ordinal} {month}'
							)}{' '}
							Session Timings
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<VStack>
								{slots.map((slot) => (
									<Text>{slot}</Text>
								))}
							</VStack>
						</ModalBody>
					</ModalContent>
				</Modal>
			</VStack>
			<Grid
				templateColumns='repeat(auto-fit, minmax(50px,1fr))'
				gap={2}
				align='center'
				maxWidth={300}
			>
				<Box>
					<Text fontSize='xs'>Age Limit</Text>
					<Text fontWeight='bold'>{min_age_limit}</Text>
				</Box>
				<Box>
					<Text fontSize='xs'>Capacity</Text>
					<Text fontWeight='bold'>{available_capacity}</Text>
				</Box>
				{vaccine.length ? (
					<Box>
						<Text>Vaccine Used</Text>
						<Text>{vaccine}</Text>
					</Box>
				) : null}
			</Grid>
		</Flex>
	);
};

export default Session;
