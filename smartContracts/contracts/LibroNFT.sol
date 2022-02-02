// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./library/base64.sol";
import "./Marketplace.sol";

contract LibroNFT is ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    struct Attr {
        string title;
        string author;
        string photoURL;
        string synopsis;
        string ISBN;
    }

    mapping(uint256 => Attr) public attributes;

    Counters.Counter private _tokenIdCounter;

    bytes32 public constant LIBRARIAN = keccak256("LIBRARIAN");

    address public marketplaceAddress;

    //address owner,string memory name, string memory symbol) ERC721(name, symbol)
    constructor(address owner) ERC721("LibroNFT", "LIBRO") {
        _grantRole(DEFAULT_ADMIN_ROLE, owner);

        _grantRole(LIBRARIAN, owner);
        _setRoleAdmin(LIBRARIAN, DEFAULT_ADMIN_ROLE);
    }

    function addMarketPlaceAddress(address _marketplaceAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        marketplaceAddress = _marketplaceAddress;
        setApprovalForAll(marketplaceAddress, true);
    }

    function addAdmin(address newAdmin)
        public
        virtual
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (bool)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, newAdmin);
        return true;
    }

    function addLibrarian(address newLibrarian)
        public
        virtual
        onlyRole(LIBRARIAN)
        returns (bool)
    {
        _grantRole(LIBRARIAN, newLibrarian);
        return true;
    }

    function isLibrarian(address _address) public view returns (bool) {
        return hasRole(LIBRARIAN, _address);
    }

    function revokeLibrarian(address oldLibrarian)
        public
        virtual
        onlyRole(LIBRARIAN)
        returns (bool)
    {
        require(
            !hasRole(DEFAULT_ADMIN_ROLE, oldLibrarian),
            "No se puede eliminar al superadmin"
        );
        _revokeRole(LIBRARIAN, oldLibrarian);
        return true;
    }

    function safeMint(
        string memory title,
        string memory author,
        string memory photoURL,
        string memory synopsis,
        string memory ISBN
    ) public onlyRole(LIBRARIAN) {
        require(
            marketplaceAddress != address(0),
            "Tiene que existir un marketplaceAddress"
        );
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(marketplaceAddress, tokenId);

        Marketplace market = Marketplace(marketplaceAddress);
        market.addBook(tokenId, msg.sender);

        attributes[tokenId] = Attr(title, author, photoURL, synopsis, ISBN);
        // _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    //La keyword "super" hace referencia al objeto padre que se encuentre de derecha a izquierda, en este caso ERC721URIStorage
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
        onlyRole(LIBRARIAN)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        attributes[tokenId].title,
                        '",',
                        '"image_data": "',
                        attributes[tokenId].photoURL,
                        '",',
                        '"attributes": [{"trait_type": "synopsis", "value": "',
                        attributes[tokenId].synopsis,
                        '"},',
                        '{"trait_type": "ISBN", "value": "',
                        attributes[tokenId].ISBN,
                        '"},',
                        '{"trait_type": "author", "value": "',
                        attributes[tokenId].author,
                        '"}',
                        "]}"
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override(ERC721) {
        require(
            marketplaceAddress != address(0),
            "Tiene que existir un marketplaceAddress"
        );
        require(
            msg.sender == marketplaceAddress,
            "Solo puede haber transferencias dentro del marketplaceAddress"
        );
        if (from != marketplaceAddress) {
            super._setApprovalForAll(from, marketplaceAddress, true);
        }

        super._safeTransfer(from, to, tokenId, _data);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721) {
        require(
            marketplaceAddress != address(0),
            "Tiene que existir un marketplaceAddress"
        );
        require(
            msg.sender == marketplaceAddress,
            "Solo puede haber transferencias dentro del marketplaceAddress"
        );
        if (from != marketplaceAddress) {
            super._setApprovalForAll(from, marketplaceAddress, true);
        }
        super.transferFrom(from, to, tokenId);
    }

    function existTokenID(uint256 _tokenID) public view returns (bool) {
        return super._exists(_tokenID);
    }
}
