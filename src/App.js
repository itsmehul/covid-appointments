import {
	Alert,
	AlertIcon,
	Box,
	Container,
	Flex,
	Grid,
	IconButton,
	Link,
	useColorMode,
	useColorModeValue,
	useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import './App.css';
import logo from './assets/logo.png';
import m3 from './assets/notification-tone.mp3';
import SearchByDistrict from './components/SearchByDistrict';
import SessionByDistrict from './components/SessionByDistrict';

let audio = new Audio(m3);

function App() {
	const [sessions, setSessions] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const { toggleColorMode } = useColorMode();
	const toast = useToast();
	const text = useColorModeValue('dark', 'light');
	const SwitchIcon = useColorModeValue(FaMoon, FaSun);

	const fetchLocationsByDistrict = (district_id, date, ageRestriction) => {
		setIsSearching(true);

		toast({
			title: `Sit tight, you will hear a celebratory soundtrack soon!`,
			status: 'info',
			isClosable: true,
		});
		var intervalId = setInterval(async () => {
			try {
				const { data } = await axios.get(
					`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${date}`
				);
				let foundSessions = data.sessions
				if(ageRestriction!=='Any'){
				foundSessions = data.sessions.filter(
					(session) =>
						String(session.min_age_limit) === ageRestriction
				)}

				if (foundSessions.length > 0) {
						audio.play();
						clearInterval(intervalId);
						setIsSearching(false);
						setSessions(foundSessions);
						toast({
							title: `Session found!`,
							status: 'success',
							isClosable: true,
						});
				}
			} catch (error) {
				console.log('none found');
			}
		}, 5000);
	};

	return (
		<Box>
			<Flex justify='flex-end'>
				<IconButton
					size='md'
					fontSize='lg'
					variant='ghost'
					color='current'
					marginLeft='2'
					onClick={toggleColorMode}
					icon={<SwitchIcon />}
					aria-label={`Switch to ${text} mode`}
				/>
			</Flex>
			<Flex justify='center'>
				<img
					src={logo}
					width={100}
					height={100}
					alt='Vaccination Hunter'
				/>
			</Flex>
			<Container maxW='container.md'>
				<SearchByDistrict
					fetchLocationsByDistrict={fetchLocationsByDistrict}
					isSearching={isSearching}
				/>
				{sessions.length !== 0 && (
					<Alert status='info' marginTop={5}>
						<AlertIcon />
						Hurry! Book now on the Aarogya Setu App! It can be hard
						to find a free slot. If you weren't able to. Please
						click on search to try again! Seats available can be
						indicative of your chances to snag one.
					</Alert>
				)}
			</Container>
			<Grid
				templateColumns='repeat(auto-fit, minmax(300px,350px))'
				gap={2}
				width='100%'
				justifyContent='center'
				padding='8'
			>
				{sessions.map((session) => (
					<SessionByDistrict {...session} />
				))}
			</Grid>
			<Container maxW='container.md'>
				{isSearching && (
					<Alert status='info' marginTop={5}>
						<AlertIcon />
						Free tip! If you're a mobile user. Start your search and
						carry on with your other apps, as long as you don't
						close the tab you're good. If you're a desktop user then
						just keep the tab open on the side. Note that you will
						hear a loud-ish soundtrack when a match is found.
						Also, you're more likely to find a slot between 5-8.
					</Alert>
				)}
			</Container>
			<Flex justify='center' padding={5}>
				<Link href='https://itsmehul.github.io' isExternal>
					Made with ♥ by Mehul
				</Link>
			</Flex>
		</Box>
	);
}

export default App;
