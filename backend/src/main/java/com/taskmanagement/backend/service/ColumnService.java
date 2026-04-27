package com.taskmanagement.backend.service;

import com.taskmanagement.backend.entity.Board;
import com.taskmanagement.backend.entity.BoardColumn;
import com.taskmanagement.backend.repository.ColumnRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ColumnService {

    private final ColumnRepository columnRepository;
    private final BoardService boardService;

    public ColumnService(ColumnRepository columnRepository, BoardService boardService) {
        this.columnRepository = columnRepository;
        this.boardService = boardService;
    }

    @Transactional(readOnly = true)
    public List<BoardColumn> findByBoard(UUID boardId) {
        return columnRepository.findByBoardIdOrderByPositionAsc(boardId);
    }

    @Transactional(readOnly = true)
    public BoardColumn findById(UUID id) {
        return columnRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Column not found: " + id));
    }

    public BoardColumn create(UUID boardId, BoardColumn column) {
        Board board = boardService.findById(boardId);
        column.setBoard(board);
        return columnRepository.save(column);
    }

    public BoardColumn update(UUID id, BoardColumn patch) {
        BoardColumn existing = findById(id);
        if (patch.getName() != null) {
            existing.setName(patch.getName());
        }
        existing.setPosition(patch.getPosition());
        return columnRepository.save(existing);
    }

    public void delete(UUID id) {
        BoardColumn existing = findById(id);
        columnRepository.delete(existing);
    }
}
