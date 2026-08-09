package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.BaseEntity;

import java.io.Serializable;
import java.util.List;

public interface BaseService<T extends BaseEntity, ID extends Serializable> {
    List<T> findAll();
    T findById(ID id);
    T save(T entity);
    T update(T entity);
    boolean delete(ID id);
}
