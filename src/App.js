import {
	Alert,
	AlertIcon,
	Box,
	Container,
	Divider,
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
				if (data.sessions.length > 0) {
					if (
						ageRestriction !== 'Any' &&
						data.sessions.find(
							(session) =>
								String(session.min_age_limit) === ageRestriction
						)
					) {
						audio.play();
						clearInterval(intervalId);
						setIsSearching(false);
						setSessions(data.sessions);
						toast({
							title: `Session found!`,
							status: 'success',
							isClosable: true,
						});
					}
					if (ageRestriction === 'Any') {
						audio.play();
						clearInterval(intervalId);
						setIsSearching(false);
						setSessions(data.sessions);
						toast({
							title: `Session found!`,
							status: 'success',
							isClosable: true,
						});
					}
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
			<Container maxW='container.md' paddingTop={10}>
				<SearchByDistrict
					fetchLocationsByDistrict={fetchLocationsByDistrict}
					isSearching={isSearching}
				/>
				{sessions.length !== 0 && (
					<Alert status='info' marginTop={5}>
						<AlertIcon />
						It can be hard to find a free slot. If you weren't able
						to. Please click on search to try again!
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
				{sessions.map((session, i) => (
					<>
						{i !== 0 && <Divider />}
						<SessionByDistrict {...session} />
					</>
				))}
			</Grid>
			<Flex justify='center' padding={5}>
				<Link href='https://itsmehul.github.io' isExternal>
					Made with ♥ by Mehul
				</Link>
			</Flex>
		</Box>
	);
}

export default App;
