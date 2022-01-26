// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Marketplace is IERC721Receiver {
    using SafeMath for uint256;

    event Received();

    struct Book {
        bool isActive;
        uint256 tokenID;
    }
    uint256 public totalBooks;
    mapping(uint256 => Book) public booksAvailable; // index => tokenID

    ERC721 tokenContract;

    constructor(address tokenAddress) {
        tokenContract = ERC721(tokenAddress);
    }

    function addBook(uint256 tokenID) public {
        booksAvailable[totalBooks] = Book(true, tokenID); // Añadimos el libro disponible
        totalBooks = totalBooks.add(1); //Incrementamos el total de libros disponibles
        if (msg.sender != address(tokenContract)) {
            tokenContract.transferFrom(msg.sender, address(this), tokenID);
        }
    }

    function rentBook(uint256 index) public {
        require(index <= totalBooks, "ID inexistente");
        require(booksAvailable[index].isActive, "Must be active");
        booksAvailable[index].isActive = false;
        tokenContract.transferFrom(
            address(this),
            msg.sender,
            booksAvailable[index].tokenID
        );
    }

    //Me devuelve el libro activo en el indice indicado
    function getActiveBooksByIndex(uint256 index)
        public
        view
        returns (uint256)
    {
        uint256 j;
        for (uint256 i = 0; i < totalBooks; i++) {
            if (booksAvailable[i].isActive) {
                if (index == j) {
                    return i;
                }
                j += 1;
            }
        }
        return 0;
    }

    // Devuelve cuantos libros hay disponibles.
    function getActiveBooksCount() public view returns (uint256) {
        uint256 result;
        for (uint256 i = 0; i < totalBooks; i++) {
            if (booksAvailable[i].isActive) {
                result += 1;
            }
        }
        return result;
    }

    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    ) external override returns (bytes4) {
        _operator;
        _from;
        _tokenId;
        _data;
        emit Received();
        return 0x150b7a02;
    }
}
