import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Container,
	Flex,
	Grid,
	IconButton,
	Link,
	Tag,
	useColorMode,
	useColorModeValue,
	useMediaQuery,
	useToast,
	VStack
} from '@chakra-ui/react';
import axios from 'axios';
import {
	addHours,
	endOfToday,
	format,
	isWithinInterval,
	startOfToday
} from 'date-fns';
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
	const [isMobile] = useMediaQuery('(max-width: 460px)');

	const isTonight = isWithinInterval(new Date(), {
		start: addHours(startOfToday(), 20),
		end: endOfToday(),
	});

	const fetchLocationsByDistrict = (district_id, date, ageRestriction) => {
		setIsSearching(true);

		toast({
			title: `Sit tight, you will hear a celebratory soundtrack soon!`,
			status: 'info',
			isClosable: true,
		});
		var intervalId = setInterval(async () => {
			try {
				// const {data:tomorrowsData} = await axios.get(
				// 	`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${date}`
				// );
				// const {data:todaysData} = await axios.get(
				// 	`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${format(startOfToday(), 'dd-MM-yyyy')}`
				// );

				

				const [
					{ data: tomorrowsData },
					{ data: todaysData },
				] = await Promise.all([
					axios.get(
						`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${date}`
					),
					!isTonight &&
						axios.get(
							`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${format(
								startOfToday(),
								'dd-MM-yyyy'
							)}`
						),
				]);

				let foundSessions = [
					...tomorrowsData.sessions,
					...todaysData.sessions,
				];
				if (ageRestriction !== 'Any') {
					foundSessions = foundSessions.filter(
						(session) =>
							String(session.min_age_limit) === ageRestriction
					);
				}

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
				console.log(error);
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
					isTonight
				/>
				<VStack margin='auto' maxW='md'>
					{sessions.length !== 0 && (
						<Alert status='info' marginTop={5}>
							<AlertIcon />
							Hurry! Book now on the Aarogya Setu App! It can be
							hard to find a free slot. If you weren't able to.
							Please click on search to try again! Seats available
							can be indicative of your chances to snag one.
						</Alert>
					)}
					{sessions.length !== 0 && (
						<Button
							variant='outline'
							onClick={() => {
								audio.pause();
								audio.src = m3;
							}}
						>
							Stop music
						</Button>
					)}
				</VStack>
			</Container>
			<Grid
				templateColumns='repeat(auto-fit, minmax(300px,350px))'
				gap={2}
				width='100%'
				justifyContent='center'
				padding='8'
			>
				{sessions.map((session) => (
					<SessionByDistrict {...session} key={session.center_id} />
				))}
			</Grid>
			<VStack maxW='md' margin='auto'>
				{isSearching && (
					<Alert status='info' marginTop={5}>
						<AlertIcon />
						Awesome! You may switch apps now, just leave this open
						in the background. You will hear a loud-ish soundtrack
						when a match is found. You're more likely to find a slot
						between 5-8.
					</Alert>
				)}
				{!isMobile && (
					<Alert status='info' marginTop={5}>
						<AlertIcon />
						Accessing the mobile version is super convenient.
					</Alert>
				)}
			</VStack>
			<VStack justify='center' padding={5}>
				<Link
					href='https://www.reddit.com/r/CoronavirusIndia/comments/n4odun/hey_i_made_a_website_to_search_for_vaccination/'
					isExternal
				>
					<Tag>Comment on this thread for feature requests!</Tag>
				</Link>
				<Link href='https://itsmehul.github.io' isExternal>
					Made with ♥ by Mehul
				</Link>
			</VStack>
		</Box>
	);
}

export default App;
