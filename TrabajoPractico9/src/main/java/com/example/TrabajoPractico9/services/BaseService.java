package com.example.TrabajoPractico9.services;

import com.example.TrabajoPractico9.entities.BaseEntity;

import java.io.Serializable;
import java.util.List;

public interface BaseService<T extends BaseEntity, ID extends Serializable> {
    List<T> findAll() throws Exception;
    T findById(ID id) throws Exception;
    T save(T entity) throws Exception;
    T update(T entity) throws Exception;
    boolean delete(ID id) throws Exception;
}
