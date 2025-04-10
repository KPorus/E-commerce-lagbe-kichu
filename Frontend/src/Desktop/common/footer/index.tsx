"use client";
import { Box, Flex, Text, Link, Icon } from "@chakra-ui/react";
import Image from "next/image";
import logo from "/public/Lagba Kichu1.png";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <Box backgroundColor="#8A8FB9" mt={8}>
      <Box p={8}>
        <Flex direction={"column"} justify="space-between" wrap="wrap">
          {/* Logo */}
          <Box mb={4} textAlign={"left"}>
            <Image src={logo} alt="Logo" width={80} height={80} />
            <Text color="white" fontSize="lg" fontWeight="bold" mt={2}>
              Shopex
            </Text>
          </Box>

          {/* Navigation Links */}
          <Flex direction={"row"} gap={4} mb={4}>
            <Link href="#" color="white" _hover={{ color: "#FB2E86" }}>
              About Us
            </Link>
            <Link href="#" color="white" _hover={{ color: "#FB2E86" }}>
              Privacy Policy
            </Link>
            <Link href="#" color="white" _hover={{ color: "#FB2E86" }}>
              Terms & Conditions
            </Link>
          </Flex>

          {/* Social Media Icons */}
          <Flex gap={4}>
            <Link href="https://facebook.com">
              <Icon
                as={FaFacebook}
                color="white"
                boxSize={6}
                _hover={{ color: "#FB2E86" }}
              />
            </Link>
            <Link href="https://twitter.com">
              <Icon
                as={FaTwitter}
                color="white"
                boxSize={6}
                _hover={{ color: "#FB2E86" }}
              />
            </Link>
            <Link href="https://instagram.com">
              <Icon
                as={FaInstagram}
                color="white"
                boxSize={6}
                _hover={{ color: "#FB2E86" }}
              />
            </Link>
          </Flex>
        </Flex>
        <hr className="h-1 bg-slate-300" style={{
            marginTop:'1rem'
        }}></hr>
        <Box textAlign="center" mt={4}>
          <Text color="white" fontSize="sm">
            &copy; {new Date().getFullYear()} Shopex. All Rights Reserved.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
