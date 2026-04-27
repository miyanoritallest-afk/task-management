package com.taskmanagement.backend.controller;

import com.taskmanagement.backend.entity.BoardColumn;
import com.taskmanagement.backend.service.ColumnService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ColumnController {

    private final ColumnService columnService;

    public ColumnController(ColumnService columnService) {
        this.columnService = columnService;
    }

    @GetMapping("/boards/{boardId}/columns")
    public ResponseEntity<List<BoardColumn>> getByBoard(@PathVariable UUID boardId) {
        return ResponseEntity.ok(columnService.findByBoard(boardId));
    }

    @GetMapping("/columns/{id}")
    public ResponseEntity<BoardColumn> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(columnService.findById(id));
    }

    @PostMapping("/boards/{boardId}/columns")
    public ResponseEntity<BoardColumn> create(@PathVariable UUID boardId,
                                              @Valid @RequestBody BoardColumn column) {
        return ResponseEntity.status(HttpStatus.CREATED).body(columnService.create(boardId, column));
    }

    @PatchMapping("/columns/{id}")
    public ResponseEntity<BoardColumn> update(@PathVariable UUID id,
                                              @RequestBody BoardColumn patch) {
        return ResponseEntity.ok(columnService.update(id, patch));
    }

    @DeleteMapping("/columns/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        columnService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
