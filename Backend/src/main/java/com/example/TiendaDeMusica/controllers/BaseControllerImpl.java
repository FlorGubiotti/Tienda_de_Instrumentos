package com.example.TiendaDeMusica.controllers;


import com.example.TiendaDeMusica.entities.BaseEntity;
import com.example.TiendaDeMusica.services.BaseServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public abstract class BaseControllerImpl<T extends BaseEntity, S extends BaseServiceImpl<T, Long>> implements BaseController<T, Long> {

    protected S servicio;

    public BaseControllerImpl(S servicio) {
        this.servicio = servicio;
    }

    @GetMapping("")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(servicio.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(servicio.findById(id));
    }

    @PostMapping("")
    public ResponseEntity<?> save(@Valid @RequestBody T entity){
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody T entity) {
        entity.setId(id);
        T updatedEntity = servicio.update(entity);
        return ResponseEntity.status(HttpStatus.OK).body(updatedEntity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        servicio.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
