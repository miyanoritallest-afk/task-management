package com.taskmanagement.backend.controller;

import com.taskmanagement.backend.entity.Board;
import com.taskmanagement.backend.service.BoardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping
    public ResponseEntity<List<Board>> getAll() {
        return ResponseEntity.ok(boardService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Board> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(boardService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Board> create(@Valid @RequestBody Board board) {
        return ResponseEntity.status(HttpStatus.CREATED).body(boardService.create(board));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Board> update(@PathVariable UUID id, @RequestBody Board patch) {
        return ResponseEntity.ok(boardService.update(id, patch));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        boardService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
