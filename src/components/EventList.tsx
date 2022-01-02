import axios from 'axios';
import React from "react";
import moment from "moment";
import { useEthers } from '@usedapp/core';
import DatePicker from "react-datepicker";
import { CSVLink } from 'react-csv';


import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

import { ExternalLinkIcon, DownloadIcon } from "@chakra-ui/icons";
import { Center, Heading, Flex, Spacer, Box, Image, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Link, Tooltip } from '@chakra-ui/react'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Button,
    AccordionIcon,
    Spinner
} from '@chakra-ui/react'

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from '@chakra-ui/react'

import ConnectButton from "./ConnectButton";

type Props = {
    handleOpenModal: any;
};

interface Event {
    contract_name: string;
    transaction_gasfee: number;
    price: number;
    timestamp: number;
    transaction_hash: string;
}

interface Record {
    events: [Event];
    event_type: string;
    total_sum: number;
}

const dfkReportsApiKey = "xxx"

export default function EventList({ handleOpenModal }: Props) {

    const { activateBrowserWallet, account } = useEthers()


    const [income, setIncome] = React.useState([]);
    const [expenses, setExpenses] = React.useState([]);
    const [totalIncome, setTotalIncome] = React.useState(0.0);
    const [totalExpenses, setTotalExpenses] = React.useState(0.0);
    const [endDate, setEndDate] = React.useState<Date | null>(new Date());
    const [startDate, setStartDate] = React.useState<Date | null>(new Date());
    const [isLoading, setIsLoading] = React.useState(false);


    function getEventsForWallet() {
        setIsLoading(true)
        let baseurl = `http://api.dfkreports.com/events/${account}`
        if (startDate != null && endDate != null) {
            baseurl = `${baseurl}?date_gte=${Math.floor(startDate.valueOf() / 1000)}&date_lte=${Math.floor(endDate.valueOf() / 1000)}`
        } else {
            baseurl = `${baseurl}/`
        }

        axios.get(baseurl, { headers: { "x-api-key": dfkReportsApiKey } })
            .then(response => {
                setIsLoading(false);
                setIncome(response.data.income);
                setExpenses(response.data.expenses);
                setTotalIncome(response.data.total_income);
                setTotalExpenses(response.data.total_expenses);
                console.log(response);
            });

    }

    return account ? (
        <Box justifyContent="top"
            alignItems="center"
            minHeight="100vh"
        >
            <Box bg="#d99559" w='100%' p={4}>
                <Flex>
                    <Box w='70px'>
                        <Image boxSize='50px'
                            objectFit='cover' alt="JEWEL" src={require("../assets/dfk_logo.png")} />
                    </Box>
                    <Box w='390px'>
                        <Heading as='h2' size='2xl'> DFK Reports</Heading>
                    </Box>
                    <Box w="300px" p='3px' m='2px' borderWidth='1px' borderRadius='lg' borderColor='black'>
                        <Text>Select Start Date</Text>
                        <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} />
                    </Box>
                    <Box w="300px" p='3px' m='2px' borderWidth='1px' borderRadius='lg' borderColor='black'>
                        <Text>Select End Date</Text>
                        <DatePicker selected={endDate} onChange={(date: Date | null) => setEndDate(date)} />
                    </Box>
                    <Box p='3px' m='2px'>
                        <Button p='3px' variant='outline' onClick={getEventsForWallet}>
                            Search Transactions
                        </Button>
                    </Box>
                    <Box>
                        {isLoading &&
                            <Spinner
                                thickness='4px'
                                speed='0.85s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl'
                            />}
                    </Box>
                    <Spacer />
                    <Box>
                        <ConnectButton handleOpenModal={handleOpenModal} />
                    </Box>
                </Flex>
            </Box>
            <Box bg="white" w='99%' m={2} borderRadius='lg'>
                <Tabs isFitted variant='enclosed'>
                    <TabList color="black">
                        <Tab><Text><b>Income:</b> {Math.round(totalIncome * 100) / 100} $ </Text></Tab>
                        <Tab><Text><b>Expenses:</b> {Math.round(totalExpenses * 100) / 100} $</Text></Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {income.map((record: Record) => (
                                <Accordion sx={{ bgcolor: "#b0b0b0", m: 1 }} allowToggle>
                                    <AccordionItem borderStyle='hidden'>
                                        <h2>
                                            <AccordionButton borderRadius='lg' bgColor='#b0b0b0'>
                                                <Box flex='1' textAlign='left'>
                                                    <Text><b>{record.event_type}</b></Text>
                                                </Box>
                                                <Text><u>Total:</u> {Math.round(record.total_sum * 100) / 100} $</Text>
                                                <AccordionIcon w="65px" />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            {record.events.length > 0 &&
                                                <Tooltip label="Export to csv">
                                                    <Button><CSVLink data={record.events} filename={`${record.event_type}_Income.csv`}>
                                                        <DownloadIcon />
                                                    </CSVLink></Button>
                                                </Tooltip>
                                            }
                                            <Table variant='striped' size='sm'>
                                                <Thead sx={{ bgcolor: "#d99559", m: 1 }}>
                                                    <Tr>
                                                        <Th width='10%'>TimeStamp</Th>
                                                        <Th with='25%'>Item</Th>
                                                        <Th width='10%'>Price</Th>
                                                        <Th width='30%'>Transaction Hash</Th>
                                                        <Th width='15%'>Transaction Gas Fee</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {record.events.map((event: Event) => (
                                                        <Tr>
                                                            <Td component="th" scope="row" width="20%">
                                                                {moment.unix(event.timestamp).format('lll')}
                                                            </Td>
                                                            <Td align="left">{event.contract_name}</Td>
                                                            <Td align="left">{event.price} $</Td>
                                                            <Td>                <Link
                                                                fontSize="sm"
                                                                display="flex"
                                                                alignItems="center"
                                                                href={`https://explorer.harmony.one/tx/${event.transaction_hash}`}
                                                                isExternal
                                                                ml={6}
                                                                _hover={{
                                                                    color: "whiteAlpha.800",
                                                                    textDecoration: "underline",
                                                                }}
                                                            >
                                                                <ExternalLinkIcon mr={1} />
                                                                {event.transaction_hash}
                                                            </Link></Td>
                                                            <Td align="right">{event.transaction_gasfee}</Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                        </TabPanel>
                        <TabPanel>
                            {expenses.map((record: Record) => (
                                <Accordion sx={{ bgcolor: "#b0b0b0", m: 1 }} allowToggle>
                                    <AccordionItem borderStyle='hidden'>
                                        <h2>
                                            <AccordionButton borderRadius='lg' bgColor='#b0b0b0'>
                                                <Box flex='1' textAlign='left'>
                                                    <Text><b>{record.event_type}</b></Text>
                                                </Box>
                                                <Text><u>Total:</u> {Math.round(record.total_sum * 100) / 100} $</Text>
                                                <AccordionIcon w="65px" />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            {record.events.length > 0 &&
                                                <Tooltip label="Export to csv">
                                                    <Button><CSVLink data={record.events} filename={`${record.event_type}_Expenses.csv`}>
                                                        <DownloadIcon />
                                                    </CSVLink></Button>
                                                </Tooltip>}
                                            <Table variant='striped'>
                                                <Thead sx={{ bgcolor: "#d99559", m: 1 }}>
                                                    <Tr>
                                                        <Th width='10%'>TimeStamp</Th>
                                                        <Th with='25%'>Item</Th>
                                                        <Th width='10%'>Price</Th>
                                                        <Th width='30%'>Transaction Hash</Th>
                                                        <Th width='15%'>Transaction Gas Fee</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {record.events.map((event: Event) => (
                                                        <Tr>
                                                            <Td component="th" scope="row" width="20%">
                                                                {moment.unix(event.timestamp).format('lll')}
                                                            </Td>
                                                            <Td align="left">{event.contract_name}</Td>
                                                            <Td align="left">{event.price} $</Td>
                                                            <Td>                <Link
                                                                fontSize="sm"
                                                                display="flex"
                                                                alignItems="center"
                                                                href={`https://explorer.harmony.one/tx/${event.transaction_hash}`}
                                                                isExternal
                                                                ml={6}
                                                                _hover={{
                                                                    color: "whiteAlpha.800",
                                                                    textDecoration: "underline",
                                                                }}
                                                            >
                                                                <ExternalLinkIcon mr={1} />
                                                                {event.transaction_hash}
                                                            </Link></Td>
                                                            <Td align="right">{event.transaction_gasfee}</Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    ) : (
        <Box minHeight="100vh">
            <Box justifyContent="top"
                alignItems="center"

            >
                <Box bg="#d99559" w='100%' p={4}>
                    <Flex>
                        <Box w='70px'>
                            <Image boxSize='50px'
                                objectFit='cover' alt="JEWEL" src={require("../assets/dfk_logo.png")} />
                        </Box>
                        <Box w='390px'>
                            <Heading as='h2' size='2xl'> DFK Reports</Heading>
                        </Box>
                        <Spacer />
                        <Box>
                            <ConnectButton handleOpenModal={handleOpenModal} />
                        </Box>
                    </Flex>

                </Box>
            </Box>
            <Box>
                <Center bg="#d99559" h='100px' color='white' m='150px'>
                    Connect to Metamask to get started
                </Center>
            </Box>
        </Box>
    );
}