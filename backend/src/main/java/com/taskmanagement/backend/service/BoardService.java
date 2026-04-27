package com.taskmanagement.backend.service;

import com.taskmanagement.backend.entity.Board;
import com.taskmanagement.backend.repository.BoardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class BoardService {

    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    @Transactional(readOnly = true)
    public List<Board> findAll() {
        return boardRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Board findById(UUID id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board not found: " + id));
    }

    public Board create(Board board) {
        return boardRepository.save(board);
    }

    public Board update(UUID id, Board patch) {
        Board existing = findById(id);
        if (patch.getName() != null) {
            existing.setName(patch.getName());
        }
        return boardRepository.save(existing);
    }

    public void delete(UUID id) {
        Board existing = findById(id);
        boardRepository.delete(existing);
    }
}
