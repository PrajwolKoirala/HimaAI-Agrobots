// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ProductStructs {
 struct Location {
        string district;
        string localBody;
        uint256 distance;
    }

    struct ProductDetails {
        string name;
        uint256 basePrice;
        bool isValid;
        bool isPaid;
        Location location;
    }
    struct ProductActors {
        address farmer;
        address collector;
        address transporter;
        address distributor;
        address retailer;
        address consumer;
    }

    struct ProductFees {
        uint256 collectorFee;
        uint256 transporterFee;
        uint256 distributorFee;
        uint256 retailerFee;
    }

    struct Product {
        uint256 id;
        ProductDetails details;
        ProductActors actors;
        ProductFees fees;
        uint8 state;
    }
}
